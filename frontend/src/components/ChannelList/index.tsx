import { Link } from 'react-router-dom';

import { CocoaChannelInfo } from '../../../../core/src';

const ChannelList = ({ list }: { list: CocoaChannelInfo[]}) => (
  <>
    {
      list.map((v) => (
        <Link to={`/front/chat/${v.channelId}`} key={v.channelId}>
          <div> {v.name} </div>
        </Link>
      ))
    }
  </>
);
export default ChannelList;
