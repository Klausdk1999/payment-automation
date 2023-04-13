import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.linkedin.com/in/klausdk1999/">
        QuickPay
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
