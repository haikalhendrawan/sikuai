 import { forwardRef} from 'react';
 import { Icon } from '@iconify/react';
 
 // ----------------------------------------------------------------------
 interface IconifyProps {
   icon: string;
   width?: number | string;
   className?: string;
   color?: string;
 }
 
 const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = '20px', className, ...other }, ref) => (
    <div ref={ref} style={{ width, height: width}} {...other}>
      <Icon icon={icon} className={`size-full`}/>
    </div>
  )
);
 
 
 export default Iconify;