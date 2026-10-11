import { Link } from 'react-router-dom';
import { buttonClassName, type ButtonSize } from '@/components/ui/buttonStyles';
import { PlusIcon } from '@/components/ui/icons';
import { paths } from '@/routes/paths';

/** A ação principal do portal da organização, no Início, na lista e nos vazios. */
export const SubmitDemandLink = ({ variant = 'primary', size }: { variant?: 'primary' | 'secondary'; size?: ButtonSize }) => (
  <Link to={paths.orgNewDemand} className={buttonClassName({ variant, size })}>
    <PlusIcon size={16} />
    Submeter demanda
  </Link>
);
