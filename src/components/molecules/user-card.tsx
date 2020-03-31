import React from "react";
import { NotionUser } from "../../lib/notion/getUsers";
import ExtLink from "../atoms/ext-link";
import styles from "./user-card.module.scss";
import { USER_ID } from "../../keys";
export default function UserCard(
  props: NotionUser & { caption: string; inline?: boolean }
) {
  const { full_name, email, profile_photo, id, caption } = props;
  const isMe = id === USER_ID;
  return (
    <>
      <ExtLink href={isMe ? `/contact` : `mailto:${email}`}>
        <div className={styles.userAvatarContainer}>
          <img
            src={profile_photo}
            alt={`${full_name}'s profile picture`}
            className={styles.UserAvatar}
          />
        </div>
        <div className={styles.userInfoContainer}>
          <div>{full_name}</div>
          <div className={styles.userCaption}>
            {caption}
            {isMe && caption && " "}
            {isMe && "(Me)"}
          </div>
        </div>
      </ExtLink>
    </>
  );
}
