import { io } from 'socket.io-client';
import { getToken } from 'src/helper/auth';

const token = getToken();
const url = process.env.VUE_APP_API_BASE_URL as string;

export const socketChannel = (channel_id: string | number) => {
  return io(url, {
    extraHeaders: {
      Authorization: `Bearer ${token.token}`,
      // @ts-ignore
      'channel-id': channel_id,
    },
  });
};
export const actionSocket = {
  connect: 'connect',
  disconnect: 'disconnect',
  exception: 'exception',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
  NEW_MESSAGE: 'NEW_MESSAGE',
  EDIT_MESSAGE: 'EDIT_MESSAGE',
  HIDE_MESSAGE: 'HIDE_MESSAGE',
  FORWARD_MESSAGE: 'FORWARD_MESSAGE',
  REACT_MESSAGE: 'REACT_MESSAGE',
  UNREACT_MESSAGE: 'UNREACT_MESSAGE',
  READ_MESSAGE: 'READ_MESSAGE',
  PIN_MESSAGE: 'PIN_MESSAGE',
  UNPIN_MESSAGE: 'UNPIN_MESSAGE',
  ACTIVITY_MESSAGE: 'ACTIVITY_MESSAGE',
  //  POLL VOTE
  NEW_POLL: 'NEW_POLL',
  NEW_ANSWER_POLL: 'NEW_ANSWER_POLL',
  READ_POLL: 'READ_POLL',
  VOTE_POLL: 'VOTE_POLL',
  CHANGE_VOTE_POLL: 'CHANGE_VOTE_POLL',
  CLOSE_POLL: 'CLOSE_POLL',
  PIN_POLL: 'PIN_POLL',
  UNPIN_POLL: 'UNPIN_POLL',
};
