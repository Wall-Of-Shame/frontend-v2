import React, { useCallback, useRef, useState } from "react";
import lodash from "lodash";
import { database } from "../../../firebase";
import { ref, query, orderByKey, onValue, set } from "firebase/database";
import { Message, UserMini } from "../../../interfaces/models/Challenges";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  differenceInMilliseconds,
  differenceInMinutes,
  format,
  formatISO,
  isSameDay,
  parseISO,
} from "date-fns";
import uniqid from "uniqid";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import AvatarImg from "../../../components/avatar";
import { useUser } from "../../../contexts/UserContext";
import { useWindowSize } from "../../../utils/WindowUtils";
import { close, paperPlane } from "ionicons/icons";

interface ChatProps {
  chatId: string;
  participants: UserMini[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const Chat: React.FC<ChatProps> = (props: ChatProps) => {
  const { chatId, participants, showModal, setShowModal } = props;
  const { user } = useUser();
  const { width } = useWindowSize();
  const chatRef = query(ref(database, `chat/${chatId}`), orderByKey());

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [hasSynced, setHasSynced] = useState(false);

  const virtuoso = useRef<VirtuosoHandle | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    lodash.debounce((newMessages: Message[]) => {
      if (newMessages.length > messages.length) {
        setMessages(newMessages);
      }
    }, 200),
    []
  );

  onValue(chatRef, (snapshot) => {
    const newTime = Date.now();
    // Debounce the events
    if (
      Math.abs(differenceInMilliseconds(lastUpdated, newTime)) < 5000 &&
      hasSynced
    ) {
      return;
    }

    const object = snapshot.val();
    if (object) {
      const parsedValues = Object.values(object) as Message[];
      if (parsedValues) {
        debouncedUpdate(parsedValues);
        setHasSynced(true);
        setLastUpdated(newTime);
      }
    }
  });

  const handleEnterKeyPress = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLIonInputElement>
  ): Promise<void> => {
    event.preventDefault();
    handleSendMessage();
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!message || message.trim().length === 0) {
      setMessage("");
      return;
    }
    const timestamp = new Date().getTime();
    try {
      set(ref(database, `chat/${chatId}/${timestamp}+${user?.userId}`), {
        messageId: uniqid(),
        name: user?.name,
        userId: user?.userId,
        content: message,
        time: formatISO(Date.now()),
      }).then(() => {
        setMessage("");
        setTimeout(() => {
          virtuoso.current?.scrollToIndex(messages.length - 1);
        }, 300);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonModal
      cssClass='use-powerup-modal'
      isOpen={showModal}
      mode='ios'
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => setShowModal(false)}
            >
              <IonIcon
                icon={close}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Chat
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <Virtuoso
        ref={virtuoso}
        totalCount={messages.length}
        itemContent={(index) => {
          const m = messages[index];
          const u = participants.find((p) => p.userId === m.userId);
          const isSelf = u?.userId === user?.userId;
          const messageTime = parseISO(m.time);
          const isSameSender =
            index > 0 &&
            messages[index].userId === messages[index - 1].userId &&
            Math.abs(
              differenceInMinutes(
                messageTime,
                parseISO(messages[index - 1].time)
              )
            ) < 1;
          const isNextSenderDiff =
            index === messages.length - 1 ||
            messages[index].userId !== messages[index + 1].userId ||
            Math.abs(
              differenceInMinutes(
                messageTime,
                parseISO(messages[index + 1].time)
              )
            ) >= 1;
          return (
            <IonRow
              key={m.messageId}
              className={
                isSelf ? "ion-justify-content-end" : "ion-justify-content-start"
              }
              style={{
                marginLeft: "1rem",
                marginRight: "1rem",
                marginTop:
                  index === 0 ? "0.25rem" : isSameSender ? "0.25rem" : "1rem",
                marginBottom: !isNextSenderDiff ? "0.25rem" : "1rem",
              }}
            >
              {u?.userId === user?.userId ? (
                <IonRow>
                  <IonCol className='ion-no-padding ion-no-margin'>
                    {!isSameSender && (
                      <IonRow className='ion-text-end'>
                        <IonCol className='ion-no-padding ion-no-margin'>
                          <IonText
                            style={{
                              fontSize: "0.8rem",
                              color: "#787878",
                            }}
                          >
                            {m.name}
                          </IonText>
                        </IonCol>
                      </IonRow>
                    )}
                    <IonRow
                      className='ion-justify-content-end'
                      style={{
                        marginBottom: !isSameSender ? "0.25rem" : "0.25rem",
                      }}
                    >
                      <IonCard
                        className='ion-no-margin ion-no-padding'
                        style={{
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          paddingLeft: "1rem",
                          paddingRight: "1rem",
                          marginLeft: "2rem",
                          borderRadius: `1rem ${
                            isSameSender ? "0.5rem" : "1rem"
                          } ${isNextSenderDiff ? "0.25rem" : "0.5rem"} 1rem`,
                        }}
                      >
                        <IonText
                          color='dark'
                          style={{
                            fontSize: "0.9rem",
                          }}
                        >
                          {m.content}
                        </IonText>
                      </IonCard>
                    </IonRow>
                    {isNextSenderDiff && (
                      <IonRow className='ion-text-end ion-justify-content-end'>
                        <IonText
                          style={{
                            fontSize: "0.7rem",
                            color: "#787878",
                            marginTop: "0.25rem",
                            marginBottom:
                              index === messages.length - 1 ? "0.5rem" : 0,
                          }}
                        >
                          {isSameDay(messageTime, new Date())
                            ? `${format(messageTime, "HH:mm")}`
                            : `${format(messageTime, "dd MM yyyy, HH:mm")}`}
                        </IonText>
                      </IonRow>
                    )}
                  </IonCol>
                  {isNextSenderDiff ? (
                    <IonRow
                      className='ion-justify-content-center ion-align-items-end'
                      style={{ marginLeft: "1rem", marginBottom: "1.5rem" }}
                    >
                      <IonAvatar
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                        }}
                      >
                        {u?.avatar !== undefined && (
                          <AvatarImg avatar={u?.avatar} />
                        )}
                      </IonAvatar>
                    </IonRow>
                  ) : (
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginLeft: "1rem",
                      }}
                    ></div>
                  )}
                </IonRow>
              ) : (
                <IonRow>
                  {isNextSenderDiff ? (
                    <IonRow
                      className='ion-justify-content-center ion-align-items-end'
                      style={{ marginRight: "1rem", marginBottom: "1.5rem" }}
                    >
                      <IonAvatar
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                        }}
                      >
                        {u?.avatar !== undefined && (
                          <AvatarImg avatar={u?.avatar} />
                        )}
                      </IonAvatar>
                    </IonRow>
                  ) : (
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginRight: "1rem",
                      }}
                    ></div>
                  )}
                  <IonCol className='ion-no-padding ion-no-margin'>
                    {!isSameSender && (
                      <IonRow className='ion-text-start'>
                        <IonCol className='ion-no-padding ion-no-margin'>
                          <IonText
                            style={{
                              fontSize: "0.8rem",
                              color: "#787878",
                            }}
                          >
                            {m.name}
                          </IonText>
                        </IonCol>
                      </IonRow>
                    )}
                    <IonRow
                      className='ion-justify-content-start'
                      style={{
                        marginBottom: !isSameSender ? "0.25rem" : "0.25rem",
                      }}
                    >
                      <IonCard
                        className='ion-no-margin ion-no-padding'
                        style={{
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                          paddingLeft: "1rem",
                          paddingRight: "1rem",
                          marginRight: "2rem",
                          borderRadius: `${
                            isSameSender ? "0.5rem" : "1rem"
                          } 1rem 1rem ${
                            isNextSenderDiff ? "0.25rem" : "0.5rem"
                          }`,
                        }}
                      >
                        <IonText
                          color='dark'
                          style={{
                            fontSize: "0.9rem",
                          }}
                        >
                          {m.content}
                        </IonText>
                      </IonCard>
                    </IonRow>
                    {isNextSenderDiff && (
                      <IonRow className='ion-text-end ion-justify-content-start'>
                        <IonText
                          style={{
                            fontSize: "0.7rem",
                            color: "#787878",
                            marginTop: "0.25rem",
                          }}
                        >
                          {isSameDay(messageTime, new Date())
                            ? `${format(messageTime, "HH:mm")}`
                            : `${format(messageTime, "dd MM yyyy, HH:mm")}`}
                        </IonText>
                      </IonRow>
                    )}
                  </IonCol>
                </IonRow>
              )}
            </IonRow>
          );
        }}
      ></Virtuoso>
      <IonFooter key='chat'>
        <IonToolbar>
          <IonRow
            className='ion-align-items-center'
            style={{ margin: "0.5rem" }}
          >
            <IonCol size={width! >= 576 ? "11" : "10.5"}>
              <IonRow className='ion-justify-content-center'>
                <div
                  style={{
                    width: "100%",
                    borderRadius: "2rem",
                    background: "#ffffff",
                    paddingLeft: "0.75rem",
                    boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
                  }}
                >
                  <IonInput
                    value={message ?? ""}
                    autoCorrect='on'
                    placeholder='Message...'
                    onIonChange={(event) => {
                      setMessage(event.detail.value ?? "");
                    }}
                    onKeyPress={(
                      event: React.KeyboardEvent<HTMLIonInputElement>
                    ) => event.key === "Enter" && handleEnterKeyPress(event)}
                  />
                </div>
              </IonRow>
            </IonCol>
            <IonCol size={width! >= 576 ? "1" : "1.5"}>
              <IonRow className='ion-justify-content-center'>
                <IonIcon
                  icon={paperPlane}
                  color='main-beige'
                  onClick={handleSendMessage}
                  style={{
                    fontSize: width! < 576 ? "1.75rem" : "2rem",
                  }}
                />
              </IonRow>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default Chat;
