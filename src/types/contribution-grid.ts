export interface ContributionGridParams {
  username: string;
  theme: 'light' | 'dark';
  year?: string;
  title?: string;
  hide_title: boolean;
  cell_size?: string;
  show_month_labels: boolean;
  show_weekday_labels: boolean;
  show_legend: boolean;
  show_border: boolean;
  border_width?: string;
  border_radius?: string;
  enable_animations: boolean;
}

export const defaultParams: ContributionGridParams = {
  username: '',
  theme: 'light',
  year: '',
  title: '',
  hide_title: false,
  cell_size: '',
  show_month_labels: true,
  show_weekday_labels: true,
  show_legend: true,
  show_border: false,
  border_width: '',
  border_radius: '',
  enable_animations: true,
};

export interface FormState {
  params: ContributionGridParams;
  generatedUrl: string;
  isCopied: boolean;
  isCopyDialogOpen: boolean;
}
