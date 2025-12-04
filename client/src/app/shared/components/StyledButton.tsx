import { styled } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import type { LinkProps } from "react-router-dom";

// extend ButtonProps to include Link's props when component={Link}
type StyledButtonProps = ButtonProps & {
  component?: React.ElementType;
  to?: LinkProps["to"];
};

const StyledButton = styled(Button)<StyledButtonProps>(({ theme }) => ({
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.text.disabled
  }
}));

export default StyledButton;
