import React, { useEffect, useRef, useState } from "react";

import { database } from "../../../firebase";
import { ref, onValue, query, orderByKey } from "firebase/database";
import { Message, UserMini } from "../../../interfaces/models/Challenges";
import { IonAvatar, IonCol, IonRow, IonText } from "@ionic/react";
import { differenceInSeconds, format, parseISO } from "date-fns";
import AvatarImg from "../../../components/avatar";
import { useUser } from "../../../contexts/UserContext";
import { useWindowSize } from "../../../utils/WindowUtils";

interface ChatProps {
  chatId: string;
  participants: UserMini[];
}

const Chat: React.FC<ChatProps> = (props: ChatProps) => {
  const { chatId, participants } = props;
  const { user } = useUser();
  const { isDesktop } = useWindowSize();
  const chatRef = query(ref(database, `chat/${chatId}`), orderByKey());

  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [hasSynced, setHasSynced] = useState(false);

  onValue(chatRef, (snapshot) => {
    const object = snapshot.val();

    const newTime = Date.now();
    // Debounce the events
    if (differenceInSeconds(lastUpdated, newTime) < 2 && hasSynced) {
      return;
    }
    setLastUpdated(newTime);
    if (object) {
      const parsedValues = Object.values(object) as Message[];
      console.log(parsedValues);
      if (parsedValues) {
        setMessages(parsedValues);
        setHasSynced(true);
      }
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div
      style={{
        overflowY: "scroll",
        height: isDesktop
          ? "calc(100vh - 375px - 3.5rem)"
          : "calc(100vh - 375px)",
      }}
    >
      {messages.map((m, index) => {
        const u = participants.find((p) => p.userId === m.userId);
        if (!u) {
          return undefined;
        }
        return (
          <IonRow
            key={m.messageId}
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            {u.userId === user?.userId ? (
              <>
                <IonCol size='10'>
                  <IonRow className='ion-no-padding'>
                    <IonCol className='ion-text-left ion-no-padding'>
                      <IonText
                        style={{
                          fontSize: "0.8rem",
                          color: "#787878",
                        }}
                      >
                        {`${format(parseISO(m.time), "dd MMM yyyy, HH:mm")}`}
                      </IonText>
                    </IonCol>
                    <IonCol className='ion-text-right ion-no-padding'>
                      <IonText
                        style={{
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                        }}
                      >
                        {m.name}
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow
                    className='ion-no-padding'
                    style={{ marginTop: "0.25rem" }}
                  >
                    <IonCol className='ion-text-right ion-no-padding'>
                      <IonText
                        style={{
                          fontSize: "0.9rem",
                        }}
                      >
                        {m.content}
                      </IonText>
                    </IonCol>
                  </IonRow>
                </IonCol>
                <IonCol size='2'>
                  <IonRow className='ion-justify-content-center'>
                    <IonAvatar
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                      }}
                    >
                      <AvatarImg avatar={u?.avatar} />
                    </IonAvatar>
                  </IonRow>
                </IonCol>
              </>
            ) : (
              <>
                <IonCol size='2'>
                  <IonAvatar
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                    }}
                  >
                    <AvatarImg avatar={u?.avatar} />
                  </IonAvatar>
                </IonCol>
                <IonCol size='10'>
                  <IonRow>
                    <IonText style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      {m.name}
                    </IonText>
                  </IonRow>
                  <IonText
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    {m.content}
                  </IonText>
                </IonCol>
              </>
            )}
          </IonRow>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chat;
