exports.getUserStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 'ENABLE': {
      state = '启用';
      break;
    }
    case 'DISABLE': {
      state = '禁用';
      break;
    }
  }
  return statusName;
};
