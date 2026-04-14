import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg';
import { ReactComponent as EmailIcon } from '../../assets/icons/email.svg';
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { ReactComponent as WriteIcon } from '../../assets/icons/write.svg';

export const iconComponents = {
  'arrow-left': ArrowLeftIcon,
  email: EmailIcon,
  lock: LockIcon,
  user: UserIcon,
  write: WriteIcon,
};

export type IconName = keyof typeof iconComponents;
