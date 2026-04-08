type ErrorContext = {
  operation: string;
  path?: string;
  userId?: string | null;
  extra?: Record<string, unknown>;
};

const toSerializableError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: 'UnknownError',
    message: typeof error === 'string' ? error : 'Unknown error',
    value: error,
  };
};

export const logAppError = (error: unknown, context: ErrorContext) => {
  const payload = {
    level: 'error',
    timestamp: new Date().toISOString(),
    operation: context.operation,
    path: context.path ?? null,
    userId: context.userId ?? null,
    error: toSerializableError(error),
    extra: context.extra ?? null,
  };

  console.error(JSON.stringify(payload, null, 2));
};
