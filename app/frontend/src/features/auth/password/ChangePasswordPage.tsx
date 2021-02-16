import {
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Error as GrpcError } from "grpc-web";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import CircularProgress from "../../../components/CircularProgress";
import PageTitle from "../../../components/PageTitle";
import TextField from "../../../components/TextField";
import { accountInfoQueryKey } from "../../../queryKeys";
import { service } from "../../../service";
import useAccountInfo from "../useAccountInfo";

interface ChangePasswordVariables {
  oldPassword?: string;
  newPassword?: string;
}

interface ChangePasswordFormData extends ChangePasswordVariables {
  passwordConfirmation?: string;
}

const useStyles = makeStyles((theme) => ({
  form: {
    "& > * + *": {
      marginBlockStart: theme.spacing(1),
    },
  },
  infoText: {
    marginBlockEnd: theme.spacing(1),
  },
}));

export default function ChangePasswordPage() {
  const classes = useStyles();
  const theme = useTheme();
  const isMdOrWider = useMediaQuery(theme.breakpoints.up("md"));

  const queryClient = useQueryClient();
  const {
    data: accountInfo,
    error: accountInfoError,
    isLoading: isAccountInfoLoading,
  } = useAccountInfo();
  const { error, isLoading, isSuccess, mutate: changePassword } = useMutation<
    Empty,
    GrpcError,
    ChangePasswordVariables
  >(
    ({ oldPassword, newPassword }) =>
      service.account.changePassword(oldPassword, newPassword),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(accountInfoQueryKey);
      },
    }
  );

  const {
    errors,
    getValues,
    handleSubmit,
    register,
  } = useForm<ChangePasswordFormData>({
    mode: "onBlur",
  });
  const onSubmit = handleSubmit(({ oldPassword, newPassword }) => {
    changePassword({ oldPassword, newPassword });
  });

  return (
    <>
      <PageTitle>Change password</PageTitle>
      {isAccountInfoLoading ? (
        <CircularProgress />
      ) : accountInfoError ? (
        <Alert severity="error">{accountInfoError.message}</Alert>
      ) : (
        <>
          {error && <Alert severity="error">{error.message}</Alert>}
          {isSuccess && (
            <Alert severity="success">
              Your password change has been processed. Check your email for
              confirmation.
            </Alert>
          )}
          <Typography className={classes.infoText} variant="body1">
            Please enter a new password, or leave the "New password" and
            "Confirm password" fields blank to unset your password.
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            {accountInfo && accountInfo.hasPassword && (
              <TextField
                id="oldPassword"
                inputRef={register({ required: true })}
                label="Old password"
                name="oldPassword"
                type="password"
                fullWidth={!isMdOrWider}
              />
            )}

            <TextField
              id="newPassword"
              inputRef={register({ required: !accountInfo?.hasPassword })}
              label="New password"
              name="newPassword"
              type="password"
              fullWidth={!isMdOrWider}
            />
            <TextField
              id="passwordConfirmation"
              inputRef={register({
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "This does not match the new password you typed above",
              })}
              label="Confirm password"
              name="passwordConfirmation"
              fullWidth={!isMdOrWider}
              type="password"
              helperText={errors.passwordConfirmation?.message}
            />
            <Button fullWidth={!isMdOrWider} loading={isLoading} type="submit">
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  );
}
