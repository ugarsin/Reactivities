import { styled } from "@mui/material/styles";
import Chip, { type ChipProps } from "@mui/material/Chip";

// Extend ChipProps if you want to support react-router Link
import type { LinkProps } from "react-router-dom";

type StyledChipProps = ChipProps & {
  component?: React.ElementType;
  to?: LinkProps["to"];
};

const StyledChip = styled(Chip)<StyledChipProps>(({ theme }) => ({
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.text.disabled
  },
  borderRadius: 6,
  fontWeight: 600
}));

export default StyledChip;