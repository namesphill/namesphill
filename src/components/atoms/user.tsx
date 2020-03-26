import React from "react";
import { NotionUser } from "../../lib/notion/getUsers";
import ExtLink from "./ext-link";
import { USER_ID } from "../../keys";
export default function UserCard(
  props: NotionUser & { caption: string; inline?: boolean }
) {
  const { full_name, email, profile_photo, id, caption } = props;
  const isMe = id === USER_ID;
  return (
    <>
      <ExtLink href={isMe ? `/contact` : `mailto:${email}`}>
        <div className="user-avatar-container">
          <img
            src={profile_photo}
            alt={`${full_name}'s profile picture`}
            className="user-avatar"
          />
        </div>
        <div className="user-info-container">
          <div>{full_name}</div>
          <div className="user-caption">
            {caption}
            {isMe && caption && " "}
            {isMe && "(Me)"}
          </div>
        </div>
      </ExtLink>
      <style jsx>{`
        .user-avatar {
          vertical-align: middle;
          border-radius: 50%;
          margin: 0 0;
        }

        .user-avatar-container {
          display: inline-block;
          margin-right: 20px;
          height: 50px;
          width: 50px;
        }

        .user-info-container {
          vertical-align: super;
          display: inline-block;
          margin: 20px 20px 25px 0;
        }

        .user-caption {
          color: #ccc;
        }
      `}</style>
    </>
  );
}
