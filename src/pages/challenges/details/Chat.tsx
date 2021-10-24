import React, { useCallback, useRef, useState } from "react";
import lodash from "lodash";
import { database } from "../../../firebase";
import { ref, query, orderByKey, onValue, set } from "firebase/database";
import { Message, UserMini } from "../../../interfaces/models/Challenges";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
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
  format,
  formatISO,
  parseISO,
} from "date-fns";
import uniqid from "uniqid";
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
  const { isDesktop, width } = useWindowSize();
  const chatRef = query(ref(database, `chat/${chatId}`), orderByKey());

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [hasSynced, setHasSynced] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    lodash.debounce((newMessages: Message[]) => {
      if (newMessages.length > messages.length) {
        setMessages(newMessages);
        setTimeout(() => {
          scrollToBottom();
        }, 200);
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
      <IonContent
        fullscreen={false}
        style={{
          height: isDesktop ? "calc(100vh - 3.5rem)" : "calc(100vh - 8rem)",
        }}
      >
        {messages.map((m, index) => {
          const u = participants.find((p) => p.userId === m.userId);
          return (
            <IonRow
              key={m.messageId}
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
            >
              {u?.userId === user?.userId ? (
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
                    <IonRow
                      className='ion-justify-content-center'
                      style={{ marginTop: "0.5rem" }}
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
                  </IonCol>
                </>
              ) : (
                <>
                  <IonCol size='2'>
                    <IonRow
                      className='ion-justify-content-center'
                      style={{ marginTop: "0.5rem" }}
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
                  </IonCol>
                  <IonCol size='10'>
                    <IonRow className='ion-no-padding'>
                      <IonCol className='ion-text-left ion-no-padding'>
                        <IonText
                          style={{
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                          }}
                        >
                          {m.name}
                        </IonText>
                      </IonCol>
                      <IonCol className='ion-text-right ion-no-padding'>
                        <IonText
                          style={{
                            fontSize: "0.8rem",
                            color: "#787878",
                          }}
                        >
                          {`${format(parseISO(m.time), "dd MMM yyyy, HH:mm")}`}
                        </IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow
                      className='ion-no-padding'
                      style={{ marginTop: "0.25rem" }}
                    >
                      <IonCol className='ion-text-left ion-no-padding'>
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
                </>
              )}
            </IonRow>
          );
        })}
        <div ref={messagesEndRef} key={messages.length} />
      </IonContent>
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
