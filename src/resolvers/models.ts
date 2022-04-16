import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.email()
    t.model.role()
    t.model.clientName()
    t.model.address()
    t.model.agreementDuration()
    t.model.billingAddress()
    t.model.emergencyContactName()
    t.model.emergencyContactNumber()
    t.model.gst()
    t.model.legalName()
    t.model.panCard()
    t.model.userId()
    t.model.phone()
    t.model.subAdminId()
    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const Document = objectType({
  name: 'Document',
  definition(t) {
    t.model.id()
    t.model.barcode()
    t.model.link()
    t.model.name()
    t.model.boxNumber()
    t.model.rackNumber()
    t.model.viewCount()
    t.model.pages()
    t.model.createdBy()
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
