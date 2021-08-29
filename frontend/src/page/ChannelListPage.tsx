import { useEffect, useState } from 'react';

import { CocoaChannelInfo } from '../../../core/src';
import ChannelList from '../components/ChannelList';
import { getChannelList } from '../util';

export default () => {
  const [list, setList] = useState<CocoaChannelInfo[]>([]);

  useEffect(() => {
    getChannelList().then((val) => {
      setList(val);
    });
  }, []);

  return (
    <ChannelList list={list} />
  );
};
