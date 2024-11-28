export default defineEventHandler(async (event) => {
  const response = await fetch('http://localhost:3000/api/client/1/collection/1/products-v2', {
    method: 'GET',
    headers: {
      'Authorization': "Bearer y1OUDAmQiU2AieXqzxePmm902rHLkOjevpxWk8A7okuxhzcfadjakjdKSDIJHhjsih@#466bCTWU7jpPij4pAzSu1695oxZL5ZSPbtDIXdXABJZrbm1L9RYayS2hc",
    },
  });
  return await response.json();
});