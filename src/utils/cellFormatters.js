// Add new formatter rules here as your APIs grow
// Each rule checks the shape of the value and returns a formatted string

export const formatCellValue = (value) => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Handle primitive values — strings, numbers, booleans
  if (typeof value !== 'object') {
    return String(value);
  }

  // Address object — has street and city
  if (value.street && value.city) {
    return `${value.street}, ${value.city}`;
  }

  // Named object — has a name property (e.g. company)
  if (value.name) {
    return value.name;
  }

  // Boolean-like object with a completed property (e.g. todos)
  if (value.completed !== undefined) {
    return value.completed ? 'Yes' : 'No';
  }

  // Fallback — stringify anything we don't recognise
  return JSON.stringify(value);
};