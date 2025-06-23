import { Checkbox } from "@/components/ui/checkbox";

interface TableSelectAllCheckboxProps<T> {
  rows: T[];
  isRowSelectable: (row: T) => boolean;
  getIsSelected: (row: T) => boolean;
  toggleSelected: (row: T, checked: boolean) => void;
}

export function TableSelectAllCheckbox<T>({
  rows,
  isRowSelectable,
  getIsSelected,
  toggleSelected,
}: TableSelectAllCheckboxProps<T>) {
  const selectableRows = rows.filter(isRowSelectable);
  const allSelected =
    selectableRows.length > 0 && selectableRows.every(getIsSelected);
  const someSelected = selectableRows.some(getIsSelected);

  const handleSelectAll = () => {
    selectableRows.forEach((row) => toggleSelected(row, !allSelected));
    // Optionally: Deselect all non-selectable rows
    rows.forEach((row) => {
      if (!isRowSelectable(row) && getIsSelected(row))
        toggleSelected(row, false);
    });
  };

  return (
    <Checkbox
      checked={allSelected ? true : someSelected ? "indeterminate" : false}
      onCheckedChange={handleSelectAll}
      aria-label="Select all"
    />
  );
}
