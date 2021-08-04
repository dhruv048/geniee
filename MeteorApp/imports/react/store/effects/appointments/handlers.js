import { api } from '..';

export const getGuestAppointments = ({ startDate, endDate, guestId, client }) => api
  .get('/api/appointment/getAppointments',
    { params: { start_date: startDate, end_date: endDate, guestId, client } });
