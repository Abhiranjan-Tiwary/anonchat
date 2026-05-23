import Room from '../models/Room.js'
import Message from '../models/Message.js'

const roomsToDelete = [
  'gaming-zone',
  'music-lounge',
  'events',
  'lost-found',
  'lost-and-found'
]

function slugFromRoom(room) {
  const source = room.slug || room.id || room.name || String(room._id || '')
  const slug = String(source)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || `room-${String(room._id).slice(-6)}`
}

export const backfillRoomSlugs = async () => {
  const rooms = await Room.collection
    .find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    })
    .toArray()

  const usedSlugs = new Set(
    (await Room.collection.find({ slug: { $nin: [null, ''] } }, { projection: { slug: 1 } }).toArray())
      .map((room) => room.slug)
      .filter(Boolean)
  )

  for (const room of rooms) {
    const baseSlug = slugFromRoom(room)
    let slug = baseSlug
    let suffix = 2

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`
      suffix += 1
    }

    usedSlugs.add(slug)

    await Room.collection.updateOne(
      { _id: room._id },
      {
        $set: {
          slug,
          id: room.id || slug,
          description: room.description || room.desc || '',
          desc: room.desc || room.description || ''
        }
      }
    )
  }
}

export const dropLegacyIndexes = async () => {
  await dropIndexIfExists(Room.db.collection('users'), 'contactNumber_1')
  await dropClientTempIdLegacyIndexes()
}

async function dropIndexIfExists(collection, indexName) {
  const indexes = await collection.indexes().catch(() => [])
  if (!indexes.some((index) => index.name === indexName)) return
  await dropIndexSafely(collection, indexName)
}

async function dropClientTempIdLegacyIndexes() {
  const collection = Message.db.collection('messages')
  const indexes = await collection.indexes().catch(() => [])
  const legacyIndexes = indexes.filter((index) => {
    if (!Object.prototype.hasOwnProperty.call(index.key || {}, 'clientTempId')) return false
    const isDesiredIndex =
      index.name === 'clientTempId_sparse_idx' &&
      index.sparse === true &&
      Object.keys(index.key || {}).length === 1 &&
      index.key.clientTempId === 1
    return !isDesiredIndex
  })

  for (const index of legacyIndexes) {
    await dropIndexSafely(collection, index.name)
  }
}

async function dropIndexSafely(collection, indexName) {
  try {
    await collection.dropIndex(indexName)
  } catch (error) {
    if (error?.code === 27 || error?.codeName === 'IndexNotFound') return
    throw error
  }
}

export const seedRooms = async () => {
  await deleteRemovedRooms()

  const defaultRooms = [
    {
      id: 'general',
      name: 'General Chat',
      slug: 'general',
      description: 'Campus-wide open discussion',
      desc: 'Campus-wide open discussion',
      icon: '💬',
      color: '#7c3aed',
      category: 'Public Room',
      isSeeded: true
    },
    {
      id: 'random-talk',
      name: 'Random Talk',
      slug: 'random-talk',
      description: 'Casual anonymous conversations',
      desc: 'Casual anonymous conversations',
      icon: '🎲',
      color: '#0ea5e9',
      category: 'Public Room',
      isSeeded: true
    },
    {
      id: 'deep-talk',
      name: 'Deep Talk',
      slug: 'deep-talk',
      description: 'Late-night honest thoughts',
      desc: 'Late-night honest thoughts',
      icon: '🌙',
      color: '#a855f7',
      category: 'Public Room',
      isSeeded: true
    },
    {
      id: 'confessions',
      name: 'Confessions',
      slug: 'confessions',
      description: 'Anonymous thoughts and campus secrets',
      desc: 'Anonymous thoughts and campus secrets',
      icon: '🤫',
      color: '#ec4899',
      category: 'Public Room',
      isSeeded: true
    }
  ]

  const count = await Room.countDocuments()
  if (count > 0) {
    await ensureSeededRoomFlags(defaultRooms)
    console.log('✓ Default rooms seeded')
    return
  }

  await Room.insertMany(defaultRooms)
  console.log('✓ Default rooms seeded')
}

async function deleteRemovedRooms() {
  await Room.deleteMany({
    $or: [
      { slug: { $in: roomsToDelete } },
      { id: { $in: roomsToDelete } }
    ]
  })
}

async function ensureSeededRoomFlags(defaultRooms) {
  for (const room of defaultRooms) {
    const { slug, id } = room

    await Room.updateOne(
      { $or: [{ slug: room.slug }, { id: room.id }] },
      {
        $set: {
          slug,
          id,
          isSeeded: true,
          status: 'active',
          visibility: room.visibility || 'public',
          name: room.name,
          description: room.description,
          desc: room.desc,
          icon: room.icon,
          color: room.color,
          category: room.category
        }
      },
      { upsert: true }
    )
  }
}
