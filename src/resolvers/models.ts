import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.role()
    t.model.hospital()
    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const Hospital = objectType({
  name: 'Hospital',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.created_by()
    t.model.document()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const Document = objectType({
  name: 'Document',
  definition(t) {
    t.model.id()
    t.model.barcode()
    t.model.link()
    t.model.name()
    t.model.created_by()
    t.model.createdAt()
    t.model.updatedAt()
  },
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('accessToken')
    t.field('user', { type: 'User' })
  },
})
