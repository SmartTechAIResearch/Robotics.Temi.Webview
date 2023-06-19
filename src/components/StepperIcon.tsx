import { styled } from "@mui/material/styles";
import { Check } from "@mui/icons-material";
import { StepConnector, stepConnectorClasses, StepIconProps } from "@mui/material";

const borderColor = '#44c8f5';
const completedActiveStyle = { [`& .${stepConnectorClasses.line}`]: { borderColor } };

//styling for stepper
export const StepperConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: completedActiveStyle,
  [`&.${stepConnectorClasses.completed}`]: completedActiveStyle,
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

//stepper styling
const StepperIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : borderColor,
    display: "flex",
    height: 22,
    alignItems: "center",
    ...ownerState.active && { color: borderColor, fontSize: "xx-large", fontWeight: 700 },
    "& .StepperIcon-completedIcon": {
      color: borderColor,
      zIndex: 1,
      fontSize: 32,
    },
    "& .StepperIcon-circle": {
      width: 16,
      height: 16,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

export default function StepperIcon({ active, completed, className }: StepIconProps) {
  return (
    <StepperIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className="StepperIcon-completedIcon" /> : <div className="StepperIcon-circle" />}
    </StepperIconRoot>
  );
}
