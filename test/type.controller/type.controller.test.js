const typeController = require('../../controller/type.controller')


test('typeController create by type Name', () => {
    expect(typeController.createN('name')).toBe('name')
})
