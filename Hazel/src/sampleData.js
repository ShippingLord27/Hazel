
export const sampleUsers = [
  { id: 'user-admin-1', firstName: 'Admin', lastName: 'User', role: 'admin', email: 'admin@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/lego/0.jpg', member_since: new Date() },
  { id: 'user-owner-1', firstName: 'Alice', lastName: 'Owner', role: 'owner', email: 'alice@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/women/1.jpg', member_since: new Date() },
  { id: 'user-owner-2', firstName: 'Bob', lastName: 'Landlord', role: 'owner', email: 'bob@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/men/2.jpg', member_since: new Date() },
  { id: 'user-owner-3', firstName: 'Charlie', lastName: 'Provider', role: 'owner', email: 'charlie@hazel.com', verification_status: 'unverified', profile_pic_url: 'https://randomuser.me/api/portraits/men/3.jpg', member_since: new Date() },
  { id: 'user-renter-1', firstName: 'Diana', lastName: 'Renter', role: 'renter', email: 'diana@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/women/4.jpg', member_since: new Date() },
  { id: 'user-renter-2', firstName: 'Ethan', lastName: 'Lessee', role: 'renter', email: 'ethan@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/men/5.jpg', member_since: new Date() },
  { id: 'user-renter-3', firstName: 'Fiona', lastName: 'Tenant', role: 'renter', email: 'fiona@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/women/6.jpg', member_since: new Date() },
  { id: 'user-renter-4', firstName: 'George', lastName: 'Hirer', role: 'renter', email: 'george@hazel.com', verification_status: 'unverified', profile_pic_url: 'https://randomuser.me/api/portraits/men/7.jpg', member_since: new Date() },
  { id: 'user-renter-5', firstName: 'Hannah', lastName: 'Occupant', role: 'renter', email: 'hannah@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/women/8.jpg', member_since: new Date() },
  { id: 'user-renter-6', firstName: 'Ivan', lastName: 'Borrower', role: 'renter', email: 'ivan@hazel.com', verification_status: 'verified', profile_pic_url: 'https://randomuser.me/api/portraits/men/9.jpg', member_since: new Date() },
];

export const sampleCategories = [
  { id: 'cat-tools', name: 'Tools' },
  { id: 'cat-electronics', name: 'Electronics' },
  { id: 'cat-vehicles', name: 'Vehicles' },
  { id: 'cat-home', name: 'Home & Garden' },
  { id: 'cat-sports', name: 'Sports & Outdoors' },
  { id: 'cat-party', name: 'Party & Events' },
  { id: 'cat-books', name: 'Books & Media' },
];

export const sampleTags = [
  { id: 'tag-power', name: 'Power Tools' },
  { id: 'tag-kitchen', name: 'Kitchen' },
  { id: 'tag-audio', name: 'Audio' },
  { id: 'tag-video', name: 'Video' },
  { id: 'tag-camping', name: 'Camping' },
  { id: 'tag-diy', name: 'DIY' },
  { id: 'tag-summer', name: 'Summer' },
  { id: 'tag-winter', name: 'Winter' },
];

export const sampleItems = [
  { id: 'item-1', title: 'Power Drill', ownerId: 'user-owner-1', categoryId: 'cat-tools', tags: ['tag-power', 'tag-diy'], description: 'A powerful drill for all your home improvement needs.', price: 10, availability: { start: new Date(), end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, images: ['/images/drill.jpg'], status: 'approved' },
  { id: 'item-2', title: 'Professional Camera', ownerId: 'user-owner-2', categoryId: 'cat-electronics', tags: ['tag-video'], description: 'High-quality DSLR camera for professional photography.', price: 50, availability: { start: new Date(), end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }, images: ['/images/camera.jpg'], status: 'approved' },
  { id: 'item-3', title: 'Mountain Bike', ownerId: 'user-owner-1', categoryId: 'cat-vehicles', tags: ['tag-sports', 'tag-summer'], description: 'A sturdy mountain bike for off-road adventures.', price: 25, availability: { start: new Date(), end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }, images: ['/images/bike.jpg'], status: 'pending' },
  { id: 'item-4', title: 'Camping Tent', ownerId: 'user-owner-3', categoryId: 'cat-sports', tags: ['tag-camping', 'tag-summer'], description: 'Spacious 4-person tent, perfect for family camping trips.', price: 30, availability: { start: new Date(), end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }, images: ['/images/tent.jpg'], status: 'approved' },
  { id: 'item-5', title: 'Electric Mixer', ownerId: 'user-owner-2', categoryId: 'cat-home', tags: ['tag-kitchen'], description: 'High-performance electric mixer for baking enthusiasts.', price: 15, availability: { start: new Date(), end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }, images: ['/images/mixer.jpg'], status: 'pending' },
  { id: 'item-6', title: 'Projector', ownerId: 'user-owner-1', categoryId: 'cat-electronics', tags: ['tag-video', 'tag-home'], description: 'HD projector for a home cinema experience.', price: 40, availability: { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, images: ['/images/projector.jpg'], status: 'rejected' },
  { id: 'item-7', title: 'Lawn Mower', ownerId: 'user-owner-3', categoryId: 'cat-home', tags: ['tag-diy'], description: 'Powerful lawn mower for large gardens.', price: 35, availability: { start: new Date(), end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) }, images: ['/images/mower.jpg'], status: 'approved' },
  { id: 'item-8', title: 'Party Speaker', ownerId: 'user-owner-2', categoryId: 'cat-party', tags: ['tag-audio'], description: 'Large Bluetooth speaker with deep bass, perfect for parties.', price: 20, availability: { start: new Date(), end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) }, images: ['/images/speaker.jpg'], status: 'approved' },
];

export const sampleFavorites = [
    { userId: 'user-renter-1', itemId: 'item-1' },
    { userId: 'user-renter-1', itemId: 'item-3' },
    { userId: 'user-renter-2', itemId: 'item-2' },
];

export const sampleChatThreads = [
    { id: 'thread-1', itemId: 'item-1', participants: ['user-renter-1', 'user-owner-1'], createdAt: new Date() },
];

export const sampleChatMessages = [
    { id: 'msg-1', threadId: 'thread-1', senderId: 'user-renter-1', content: 'Hi, I\'m interested in renting the drill.', createdAt: new Date(Date.now() - 60000) },
    { id: 'msg-2', threadId: 'thread-1', senderId: 'user-owner-1', content: 'It\'s available. When would you like to pick it up?', createdAt: new Date() },
];

export const sampleTransactions = [
  { id: 'txn-1', itemId: 'item-2', ownerId: 'user-owner-2', renterId: 'user-renter-2', rentalStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), rentalEndDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), totalCost: 150, status: 'completed' },
  { id: 'txn-2', itemId: 'item-4', ownerId: 'user-owner-3', renterId: 'user-renter-1', rentalStartDate: new Date(), rentalEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), totalCost: 90, status: 'confirmed' },
];
