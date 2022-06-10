import makeMockApp from '../../mocks/app.js'
import makeMockPool from '../../mocks/pool.js';
import makeMockRequest from '../../mocks/request.js';
import makeMockResponse from '../../mocks/response.js';
import makeMockServices from '../../mocks/services.js';
import makeMockUpload from '../../mocks/upload.js';
import items from './items.js'

describe('/items', () => {
  it('GET - returns user\'s items', async  () => {
    const [routes, app] = makeMockApp();
    const pool = makeMockPool([
      [{ user_id: 'id' }],
      [{ product_id: '1', product_name: 'product_name', product_image_url: 'image', product_description: 'description'}]
    ])
    const upload = makeMockUpload();
    const services = makeMockServices({});

    const request = makeMockRequest({});
    const response = makeMockResponse();

    items('/', {
      app,
      pool,
      upload,
      services,
    });

    expect('/' in routes.get).toBe(true);
    await routes.get['/'](request, response);

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining([
      {"description": "description", "id": "1", "imageURL": "", "name": "product_name"}]
    ))
  })
})
