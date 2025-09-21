export function handleValidationErrors(validationOutput: any) {
  if (validationOutput.length > 0) {
    const errors: Record<string, string> = {};

    validationOutput.forEach((element: any) => {
      const field = element.path || "unknown";
      const message = element.constraintType || "Invalid input";
      errors[field] = message;
    });

    // Instead of throwing a generic error, throwing a structured one
    const error: any = new Error("Validation failed");
    error.statusCode = 400; // Bad Request
    error.details = errors;
    throw error;
  }
}
