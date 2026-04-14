import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg';
import { ReactComponent as EmailIcon } from '../../assets/icons/email.svg';
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { ReactComponent as WriteIcon } from '../../assets/icons/write.svg';
import { ReactComponent as CopyIcon } from '../../assets/icons/copy.svg';
import { ReactComponent as ShareIcon } from '../../assets/icons/share.svg';
import { ReactComponent as SendIcon } from '../../assets/icons/send.svg';
import { ReactComponent as RetryIcon } from '../../assets/icons/retry.svg';

export const iconComponents = {
  'arrow-left': ArrowLeftIcon,
  email: EmailIcon,
  lock: LockIcon,
  user: UserIcon,
  write: WriteIcon,
  copy: CopyIcon,
  share: ShareIcon,
  send: SendIcon,
  retry: RetryIcon,
};

export type IconName = keyof typeof iconComponents;
