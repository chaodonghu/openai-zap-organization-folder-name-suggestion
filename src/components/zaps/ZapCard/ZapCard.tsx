import type { ResultRating, ScoredZapNode, ScoredZapOwner } from "@/types";
import { Colors, IconButton, Text, Typography } from "@zapier/design-system";
import ZapTableRowServices from "../ZapTableRow/ZapTableRowServices";
import { css } from "@emotion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PLACEHOLDER_ICON } from "@/constants";

interface ZapCardProps {
  id: number;
  nodes: ScoredZapNode[];
  owner: ScoredZapOwner;
  score: number;
  title: string;
}

const rootStyle = css`
  border-radius: 5px;
  border: 1px solid ${Colors.neutral400};
  padding: 15px;
  margin: 10px 0 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 10px;
`;

const zapContentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > a:hover h3 {
    text-decoration: underline !important;
    color: ${Colors.blueJeans} !important;
  }
`;

const ownerAndScoreStyle = css`
  ${Typography.smallPrint1}
  display: flex;
  align-items: center;
  gap: 5px;
  > img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
`;

const scoreAndRatingStyle = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  align-self: center;
`;

const ratingStyle = css`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const ZapCard = ({ id, nodes, owner, score, title }: ZapCardProps) => {

  const [rating, setRating] = useState<null | ResultRating>(null);

  const services = nodes.map((node) => {
    const src = node.selectedApi ? `https://zapier-staging.com/generated/${node.selectedApi}/128/` : PLACEHOLDER_ICON;
    return { name: node.selectedApi, src }
  });

  const handleResultRating = (rating: ResultRating) => {
    console.log(`You ${rating === "thumbsUp" ? "upvoted" : "downvoted"} the result "${title}"!`);
    setRating(rating);
  };

  return (
    <li css={rootStyle}>
      <div css={zapContentStyle}>
        <Link href={`http://www.zapier-staging.com/editor/${id}/`}><Text tag="h3" type="smallPrint1Semibold">{title}</Text></Link>
        <ZapTableRowServices services={services} />
        {
          owner.fullName && (
            <span css={ownerAndScoreStyle}><Text type="smallPrint1">
              Owned by:</Text>
              {owner.photoUrl && (<Image src={owner.photoUrl} alt="" width={20} height={20} />)}
              <Text type="smallPrint1Bold">{owner.fullName}</Text></span>
          )
        }
      </div >
      <div css={scoreAndRatingStyle}>
        <span css={ownerAndScoreStyle}><Text type="smallPrint1">Score:</Text><Text type="smallPrint1Bold">{(score * 100).toFixed(1)}%</Text></span>
        <span css={ratingStyle}>
          <IconButton color="icon-alt" icon={rating === "thumbsUp" ? "ratingThumbsUpFill" : "ratingThumbsUp"} onClick={() => handleResultRating("thumbsUp")} size="xsmall" />
          <IconButton color="icon-alt" icon={rating === "thumbsDown" ? "ratingThumbsDownFill" : "ratingThumbsDown"} onClick={() => handleResultRating("thumbsDown")} size="xsmall" />
        </span>
      </div>
    </li >
  )
};

export default ZapCard;