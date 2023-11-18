// FIXME: hacky solution to keep session in sync with zapier.com session.

import styled from "styled-components";
import { signOut } from "next-auth/react";
import { Button } from "@zapier/design-system";

// Useful when your zapier.com session expires, or when you changed accounts, etc.
const StyledSyncSessionButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;
export const SyncSessionButton = () => {
  return (
    <StyledSyncSessionButton>
      <Button iconBefore="arrowRefresh" onClick={() => signOut()}>Sync with Zapier Session</Button>
    </StyledSyncSessionButton>
  );
};
