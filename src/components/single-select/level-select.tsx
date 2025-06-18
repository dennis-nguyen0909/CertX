import { useCallback, useState } from "react";

import { SingleSelect, Option } from "./base";

enum SkillLevel {
  beginner = "beginner",
  intermediate = "intermediate",
  advanced = "advanced",
}

export default function LevelSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
}) {
  const [search, setSearch] = useState("");

  const handleChange = useCallback(
    (value: Option | null) => {
      onChange?.(value);
    },
    [onChange]
  );

  const handleSearch = useCallback((searchValue: string) => {
    setSearch(searchValue);
  }, []);

  const options = Object.values(SkillLevel)
    .filter((level) => level.includes(search.toLowerCase()))
    .map((level) => ({
      value: level,
      label: level.charAt(0).toUpperCase() + level.slice(1),
    }));

  return (
    <SingleSelect
      placeholder={placeholder}
      defaultValue={defaultValue ?? null}
      isLoading={false}
      options={options}
      onEndReached={() => {}}
      onSearch={handleSearch}
      onChange={handleChange}
    />
  );
}
