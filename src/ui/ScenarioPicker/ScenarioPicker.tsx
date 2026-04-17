import type { ScenarioMap } from '@/lib/types';
import styles from './ScenarioPicker.module.css';

type Props = {
  scenarios: ScenarioMap;
  value: string;
  onChange: (value: string) => void;
};

export default function ScenarioPicker({ scenarios, value, onChange }: Props) {
  const entries = Object.entries(scenarios);
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="scenario-select">
        Scenario
      </label>
      <select
        id="scenario-select"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {entries.map(([key, scenario]) => (
          <option key={key} value={key}>
            {scenario.label}
          </option>
        ))}
      </select>
    </div>
  );
}
