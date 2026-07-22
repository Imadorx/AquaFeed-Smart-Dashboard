import { SensorReading } from "../types/domain";

export interface SimulationState {
  temperature: number;
  humidity: number;
  waterLevel: number;
  solarPower: number;
  pumpStatus: boolean;
  coolingStatus: boolean;
  waterRecycle: boolean;
  elapsedMs: number;
}

const DAY_CYCLE_MS = 10 * 60 * 1000; // one simulated day compresses into 10 real minutes
const AMBIENT_BASE_TEMPERATURE = 24;
const AMBIENT_TEMPERATURE_SWING = 6;
const HUMIDITY_DECAY_PER_TICK = 0.03;
const PUMP_HUMIDITY_GAIN_PER_TICK = 0.55;
const COOLING_TEMPERATURE_DROP_PER_TICK = 0.12;
const SOLAR_HEATING_FACTOR = 0.006;
const WATER_LEVEL_DECAY_PER_TICK = 0.025;
const PUMP_WATER_CONSUMPTION_PER_TICK = 0.05;
const RECYCLE_RESTORE_PER_TICK = 0.9;
const MAX_SOLAR_KW = 5.2;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function jitter(magnitude: number): number {
  return (Math.random() * 2 - 1) * magnitude;
}

export class SimulationEngine {
  private state: SimulationState;

  constructor(initial?: Partial<SimulationState>) {
    this.state = {
      temperature: 26,
      humidity: 68,
      waterLevel: 82,
      solarPower: 0,
      pumpStatus: false,
      coolingStatus: false,
      waterRecycle: false,
      elapsedMs: 0,
      ...initial,
    };
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  setActuators(actuators: { pumpStatus?: boolean; coolingStatus?: boolean }): void {
    if (actuators.pumpStatus !== undefined) this.state.pumpStatus = actuators.pumpStatus;
    if (actuators.coolingStatus !== undefined) this.state.coolingStatus = actuators.coolingStatus;
  }

  private dayFraction(): number {
    return (this.state.elapsedMs % DAY_CYCLE_MS) / DAY_CYCLE_MS;
  }

  private computeSolarIrradiance(): number {
    const fraction = this.dayFraction();
    const sunAngle = Math.sin(fraction * Math.PI * 2 - Math.PI / 2);
    const daylight = Math.max(0, sunAngle);
    return daylight;
  }

  tick(tickMs: number): SensorReading {
    this.state.elapsedMs += tickMs;

    const irradiance = this.computeSolarIrradiance();
    const targetSolar = irradiance * MAX_SOLAR_KW;
    this.state.solarPower = clamp(
      this.state.solarPower + (targetSolar - this.state.solarPower) * 0.15 + jitter(0.05),
      0,
      MAX_SOLAR_KW
    );

    const ambientTarget =
      AMBIENT_BASE_TEMPERATURE + irradiance * AMBIENT_TEMPERATURE_SWING;
    let temperature = this.state.temperature + (ambientTarget - this.state.temperature) * 0.02;
    temperature += this.state.solarPower * SOLAR_HEATING_FACTOR;
    if (this.state.coolingStatus) {
      temperature -= COOLING_TEMPERATURE_DROP_PER_TICK;
    }
    temperature += jitter(0.06);
    this.state.temperature = clamp(temperature, 15, 42);

    let humidity = this.state.humidity - HUMIDITY_DECAY_PER_TICK;
    if (this.state.pumpStatus) {
      humidity += PUMP_HUMIDITY_GAIN_PER_TICK;
    }
    humidity -= irradiance * 0.05;
    humidity += jitter(0.15);
    this.state.humidity = clamp(humidity, 20, 95);

    let waterLevel = this.state.waterLevel - WATER_LEVEL_DECAY_PER_TICK;
    if (this.state.pumpStatus) {
      waterLevel -= PUMP_WATER_CONSUMPTION_PER_TICK;
    }
    this.state.waterRecycle = waterLevel < 35;
    if (this.state.waterRecycle) {
      waterLevel += RECYCLE_RESTORE_PER_TICK;
    }
    this.state.waterLevel = clamp(waterLevel, 0, 100);

    return {
      temperature: Number(this.state.temperature.toFixed(2)),
      humidity: Number(this.state.humidity.toFixed(2)),
      waterLevel: Number(this.state.waterLevel.toFixed(2)),
      solarPower: Number(this.state.solarPower.toFixed(2)),
      pumpStatus: this.state.pumpStatus,
      coolingStatus: this.state.coolingStatus,
      waterRecycle: this.state.waterRecycle,
      timestamp: new Date(),
    };
  }
}
