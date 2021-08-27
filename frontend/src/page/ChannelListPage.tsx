import axios from 'axios';
import { useEffect, useState } from 'react';

import { CocoaChannelInfo } from '../../../core/src';
import ChannelList from '../components/ChannelList';

export default () => {
  const [list, setList] = useState<CocoaChannelInfo[]>([]);

  useEffect(() => {
    axios.get('/channels').then((response) => {
      setList(response.data);
    });
  }, []);

  return (
    <ChannelList list={list} />
  );
};
