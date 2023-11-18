import { Spinner } from "@zapier/design-system";
import { useSession, signIn } from "next-auth/react";
import { type PropsWithChildren, useEffect } from "react";
import { Centered } from "@/components/Centered";

export function AuthRequired(props: PropsWithChildren) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("zapier");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  }

  if (status === "authenticated") {
    return <>{props.children}</>;
  }

  return null;
}
