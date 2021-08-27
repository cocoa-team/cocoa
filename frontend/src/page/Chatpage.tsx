import axios from 'axios';
import { useEffect, useState } from 'react';

import { CocoaChannelInfo } from '../../../core/src';
import Chat from '../components/Chat';

type matchType = {
  match: {
    params: {
      channelId: string,
    },
  },
};

export default (match: matchType) => {
  const [list, setList] = useState<CocoaChannelInfo[]>([]);

  useEffect(() => {
    axios.get('/channels').then((response) => {
      setList(response.data);
    });
  }, []);

  let page = <></>;
  if (list.length > 0) {
    const val = list.find((v) => (
      v.channelId === match.match.params.channelId
    ));
    if (val) {
      page = <Chat channelId={val.channelId} channelName={val.name} />;
    }
  }

  return (
    <>
      {page}
    </>
  );
};
