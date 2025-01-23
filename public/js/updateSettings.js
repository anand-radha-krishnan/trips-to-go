/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

// type is password || data
export const updateUser = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/${type === 'password' ? 'update-password' : 'update-me'}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(res.data.status, `${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
