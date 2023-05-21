import * as React from 'react';
import { Card } from '@mui/material';
import { Stack } from '@mui/system';
import { Header} from '../components/Header';
import { CircularProgress } from '@mui/material';

export default function Dashboard() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState<unknown | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/notification');
        console.log(res);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setData(json);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchData().catch(err => {
      console.error('Failed to fetch data:', err);
    });

    // Refresh data every second
    const intervalId = setInterval(() => {
      fetchData().catch(err => {
        console.error('Failed to fetch data:', err);
      });
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);


  if (error) return <div>Failed to load data</div>;
  if (!data)
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {' '}
        <CircularProgress />
      </Stack>
    );

  return (
    <>
      <Header />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Card
          sx={{
            fontSize: 25,
            textAlign: 'center',
            fontWeight: 700,
            width: 400,
            height: 70,
            p: 2,
            m: 2,
          }}
        >
          Data:
        </Card>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Card
            sx={{
              fontSize: 20,
              textAlign: 'left', // Set to 'left' for better JSON alignment
              fontWeight: 400,
              width: 800,
              height: 600,
              p: 2,
              m: 2,
              overflow: 'auto', // Enable scrolling if the content is larger than the card
            }}
          >
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
