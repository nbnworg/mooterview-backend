export function handleValidationErrors(validationOutput: any) {
  if (validationOutput.length > 0) {
    console.log("Validation Errors:");
    validationOutput.forEach((element: any) => {
      console.log(`Constraint Type: ${element.constraintType}`);
      console.log(`Path: ${element.path}`);
    });

    throw new Error(
      `Request had validation errors: ${JSON.stringify(
        validationOutput,
        null,
        2
      )}`
    );
  }
}
