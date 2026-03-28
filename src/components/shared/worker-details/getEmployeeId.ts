export function getEmployeeId(worker: any): string | undefined {
  return worker == null
    ? undefined
    : typeof worker === 'string'
      ? worker
      : (worker?.employeeID ?? worker?.empId ?? worker?.empCode ?? worker?.uid);
}
