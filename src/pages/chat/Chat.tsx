import React, { type FC } from "react";
type Props = React.ComponentProps<"div">;
const Chat: FC<Props> = ({ className }) => {
  return <div className={className}>Chat</div>;
};

export default Chat;
