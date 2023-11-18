import { css } from "@emotion/react";
import { Colors, SkeletonBlock, Spacer } from "@zapier/design-system";
import Image from "next/image";
import type { Service } from "../../../types";

const servicesLoadingStyle = css`
  display: flex;
`;

const rootStyles = css`
  display: flex;
  gap: 5px;
`;

const iconContainer = css`
  border-radius: 3px;
  border: 1px solid ${Colors.neutral300};
  height: 28px;
  width: 28px;
  padding: 4px;
`;

interface Props {
  services: Service[];
}

const ZapTableRowServices = ({ services }: Props) => {
  if (services.length) {
    return (
      <div css={rootStyles}>
        {services.map((service, index) => {
          return (
            <div key={index} css={iconContainer}>
              <Image
                src={service.src}
                alt={service.name || service.src}
                width={20}
                height={20}
                title={service.name}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div css={servicesLoadingStyle}>
      <SkeletonBlock height={30} width={30} />
      <Spacer width={5} />
      <SkeletonBlock height={30} width={30} />
    </div>
  );
};

export default ZapTableRowServices;
