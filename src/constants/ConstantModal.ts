export interface typeInfoModalConfirm {
  type: 'confirm' | 'setTime' | 'convert' | 'info';
  title: string;
  textOk: string;
  textCancel: string;
  alignFooter?:
    | 'left'
    | 'center'
    | 'right'
    | 'between'
    | 'around'
    | 'evenly'
    | 'stretch'
    | ''
    | undefined;
  desc?: string;
  label?: string;
  disabled?: boolean;
  action?: any;
}
