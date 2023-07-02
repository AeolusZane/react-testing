import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, screen } from '@testing-library/react'
import Fetch from './App';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// const server = setupServer(
//   rest.get('/greeting', (req, res, ctx) => {
//     return res(ctx.json({ greeting: 'hello there' }))
//   }),
// )

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

describe('Fetch', () => {
  var mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
  });


  test('handles server error', async () => {
    // server.use(
    //   rest.get('/greeting', (req, res, ctx) => {
    //     return res(ctx.status(500))
    //   }),
    // )
    mock.onGet('/greeting').reply(500, null);
    
    render(<Fetch url="/greeting" />)

    fireEvent.click(screen.getByText('Load Greeting'))

    await screen.findByRole('alert')

    expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
    expect(screen.getByRole('button')).not.toBeDisabled()
  });

  test('loads and displays greeting', async () => {
    render(<Fetch url="/greeting" />)
    // { data: { greeting: 'hello there' } }
    mock.onGet('/greeting').reply(200, { greeting: 'hello there' });
    fireEvent.click(screen.getByText('Load Greeting'));

    await screen.findByRole('heading')

    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    expect(screen.getByRole('button')).toBeDisabled()
  })
});
