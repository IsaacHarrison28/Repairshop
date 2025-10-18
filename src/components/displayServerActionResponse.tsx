type props = {
  result: {
    data?: {
      message?: string;
    };
    serverError: string;
    validationError: { [fieldName: string]: string[] | undefined };
  };
};

const MessageBox = ({
  type,
  content,
}: {
  type: "success" | "error";
  content: React.ReactNode;
}) => {
  return (
    <div
      className={`bg-accent px-4 py-2 my-2 rounded-lg ${
        type === "error" ? "text-red-500" : ""
      }`}
    >
      {type === "success" ? "🎉" : "🚨"} {content}
    </div>
  );
};

export function DisplayServerActionResult({ result }: props) {
  const { data, serverError, validationError } = result;
  <div>
    {data?.message && (
      <MessageBox type="success" content={`success: ${data?.message}`} />
    )}

    {serverError && <MessageBox type="error" content={serverError} />}

    {validationError && (
      <MessageBox
        type="error"
        content={Object.keys(validationError).map((key) => (
          <p key={key}>
            {`${key} : ${validationError[key as keyof typeof validationError]}`}
          </p>
        ))}
      />
    )}
  </div>;
}
