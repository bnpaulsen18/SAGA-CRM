# SAGA CRM - Completion Plan
**Created:** January 9, 2026
**Current Status:** 70% Complete
**Target:** Production-Ready CRM in 10-14 Days

---

## 🎯 Executive Summary

**What's Done (70%):**
- ✅ Core CRM structure (dashboard, contacts, donations, campaigns, reports)
- ✅ AI Agent System (31 documented, 2 working, CLI + API)
- ✅ Dark gradient theme with Phosphor icons throughout
- ✅ Loading/error states for main pages
- ✅ Donation and campaign CRUD operations
- ✅ Dashboard with real-time stats
- ✅ Multi-tenant architecture with RLS

**What's Missing (30%):**
- ❌ Contact edit/delete functionality
- ❌ Bulk operations (select multiple, export, tag, delete)
- ❌ Working search in header
- ❌ Security hardening (CSRF, rate limiting, PII encryption)
- ❌ Loading/error states for detail pages
- ❌ Advanced filters (tags, date ranges)
- ❌ Audit logging for all operations

---

## 📊 Critical Path Analysis

### Must-Have for Launch (Priority 1)
1. **Contact CRUD** - Users need to edit/delete contacts
2. **Search** - Header search must work
3. **Security** - CSRF, rate limiting, input validation
4. **Audit Logging** - Track all user actions

### Important for UX (Priority 2)
5. **Bulk Operations** - Export, delete, tag multiple items
6. **Detail Page Loading States** - Polish UX
7. **Advanced Filters** - Date ranges, tags, complex queries

### Nice-to-Have (Priority 3)
8. **More AI Agents** - Complete the 29 remaining agents
9. **Analytics Dashboard** - Deeper insights
10. **Email Integration** - Send thank-you emails

---

## 🚀 SPRINT PLAN: 10-Day Completion

### **SPRINT 1: Core CRUD & Search (Days 1-3)**

#### Day 1: Contact Edit/Delete (6-8 hours)
**Goal:** Complete contact lifecycle management

**Tasks:**
1. **Create API Route** - `app/api/contacts/[id]/route.ts`
   - GET: Fetch single contact with decryption
   - PUT: Update contact with validation
   - DELETE: Soft delete (set status to DO_NOT_CONTACT)
   - Use Zod validation from `lib/validation.ts`

2. **Create Edit Page** - `app/contacts/[id]/edit/page.tsx`
   - Use existing `ContactFormEdit` component
   - Pre-populate with decrypted data
   - Handle form submission
   - Redirect to detail page on success

3. **Add Delete Button** - `app/contacts/[id]/page.tsx`
   - Add delete confirmation dialog
   - Call DELETE endpoint
   - Show success toast
   - Redirect to contacts list

**Success Criteria:**
- ✅ Can edit contact name, email, phone, address
- ✅ Can delete contact (soft delete)
- ✅ All changes validated with Zod
- ✅ Toast notifications on success/error

**Agent Support:** Use Frontend Developer agent to generate edit page structure

---

#### Day 2: Global Search (4-6 hours)
**Goal:** Make header search functional

**Tasks:**
1. **Update Search API** - `app/api/contacts/search/route.ts` (already exists, verify)
   - Search contacts by name, email, phone
   - Limit to 10 results
   - Return decrypted data

2. **Make Search Interactive** - `components/DashboardLayout.tsx`
   - Add debounced input handler (300ms)
   - Call search API on input
   - Show dropdown results
   - Navigate to contact on click
   - Show "No results" state
   - Loading indicator

3. **Add Keyboard Navigation**
   - Arrow keys to navigate results
   - Enter to select
   - Escape to close
   - Accessibility (ARIA labels)

**Success Criteria:**
- ✅ Search updates as user types (debounced)
- ✅ Shows relevant results instantly
- ✅ Keyboard navigation works
- ✅ Mobile-friendly

**Agent Support:** Use Frontend Developer agent for dropdown component

---

#### Day 3: Detail Page UX (4-6 hours)
**Goal:** Complete loading/error states for all detail pages

**Tasks:**
1. **Create Loading States** (10 files)
   - `app/contacts/[id]/loading.tsx`
   - `app/contacts/[id]/edit/loading.tsx`
   - `app/contacts/new/loading.tsx`
   - `app/contacts/import/loading.tsx`
   - `app/donations/[id]/loading.tsx`
   - `app/donations/[id]/edit/loading.tsx`
   - `app/donations/new/loading.tsx`
   - `app/campaigns/[id]/loading.tsx`
   - `app/campaigns/[id]/edit/loading.tsx`
   - `app/campaigns/new/loading.tsx`

2. **Create Error Boundaries** (10 files)
   - Same paths as above, but `error.tsx`
   - Match existing pattern with Warning icon
   - "Try Again" and navigation buttons

**Success Criteria:**
- ✅ All pages have loading skeletons
- ✅ All pages have error boundaries
- ✅ Consistent UX across entire app

**Agent Support:** Use Frontend Developer agent to batch-generate these files

---

### **SPRINT 2: Security & Bulk Operations (Days 4-6)**

#### Day 4: Security Hardening - Part 1 (6-8 hours)
**Goal:** Implement CSRF protection and rate limiting

**Tasks:**
1. **CSRF Protection**
   - Create `lib/security/csrf.ts`
   - Generate tokens on page load
   - Validate on all POST/PUT/DELETE
   - Add to all form submissions

2. **Rate Limiting**
   - Create `lib/security/rate-limit.ts`
   - In-memory store with sliding window
   - Update `middleware.ts` to apply limits:
     - Auth endpoints: 5 req/15 min
     - API endpoints: 100 req/min
     - PDF generation: 20/min
   - Return rate limit headers

3. **Input Validation Audit**
   - Verify all API routes use Zod
   - Add validation to any missing routes
   - Sanitize all user inputs

**Success Criteria:**
- ✅ All mutations require CSRF token
- ✅ Rate limits enforced
- ✅ All inputs validated with Zod
- ✅ No SQL injection vulnerabilities

**Agent Support:** Use Backend Architect agent for security review

---

#### Day 5: Audit Logging (4-6 hours)
**Goal:** Track all user actions for compliance

**Tasks:**
1. **Create Audit System** - `lib/audit.ts`
   - `createAuditLog()` function
   - Log: user, action, resource, timestamp, metadata
   - Non-blocking (errors logged, don't fail request)

2. **Add Audit Calls** to all routes:
   - Contact CREATE/UPDATE/DELETE
   - Donation CREATE/UPDATE/DELETE
   - Campaign CREATE/UPDATE/DELETE
   - Bulk operations
   - Login/logout events

3. **Create Audit Log Viewer** - `app/admin/audit/page.tsx`
   - Table of all audit logs
   - Filter by user, action, date
   - Export to CSV
   - Admin-only access

**Success Criteria:**
- ✅ All CRUD operations logged
- ✅ Logs include user, resource, changes
- ✅ Admin can view and export logs
- ✅ Performance impact < 10ms

**Agent Support:** Use Backend Architect agent for audit schema design

---

#### Day 6: Bulk Operations (6-8 hours)
**Goal:** Enable multi-select and batch actions

**Tasks:**
1. **Bulk API Endpoint** - `app/api/contacts/bulk/route.ts` (already exists, verify)
   - Actions: 'tag', 'export', 'delete', 'update-status'
   - Take array of contactIds (max 1000)
   - Return success/failure count
   - Audit log bulk operations

2. **Bulk Actions UI** - `components/contacts/BulkActionsBar.tsx`
   - Floating bar when items selected
   - Shows count selected
   - Actions: Export CSV, Add Tag, Delete, Change Status
   - Confirmation dialogs for destructive actions

3. **Add Checkboxes** - `components/contacts/ContactsTable.tsx`
   - Checkbox column
   - "Select All" in header
   - Track selected IDs in state
   - Show bulk actions bar when > 0 selected

**Success Criteria:**
- ✅ Can select multiple contacts
- ✅ Can export selected to CSV
- ✅ Can add tags to multiple
- ✅ Can bulk delete with confirmation
- ✅ Bulk operations logged

**Agent Support:** Use Frontend Developer agent for bulk actions UI

---

### **SPRINT 3: Advanced Features & Polish (Days 7-9)**

#### Day 7: PII Encryption (4-6 hours)
**Goal:** Encrypt sensitive data at rest

**Tasks:**
1. **Update Encryption Module** - `lib/encryption.ts`
   - Already has encrypt/decrypt functions
   - Verify AES-256-GCM used
   - Test with existing data

2. **Encrypt on Write**
   - `app/api/contacts/route.ts` - POST
   - `app/api/contacts/[id]/route.ts` - PUT
   - Encrypt: email, phone, street, city, state, zip, notes

3. **Decrypt on Read**
   - All contact fetch queries
   - Use `decryptContactPII()` helper
   - Backwards compatible (check if already encrypted)

4. **Migration Script** - `scripts/encrypt-existing-data.ts`
   - Fetch all unencrypted contacts
   - Encrypt PII fields
   - Update in batches of 100
   - Log progress

**Success Criteria:**
- ✅ All new contacts encrypted
- ✅ Decryption transparent
- ✅ Existing data migrated
- ✅ No performance impact

**Agent Support:** Use Backend Architect agent for migration script

---

#### Day 8: Advanced Filters (6-8 hours)
**Goal:** Add powerful filtering options

**Tasks:**
1. **Enhance Contact Filters** - `components/contacts/ContactsFilters.tsx`
   - Add tags filter (multi-select)
   - Add "Last gift date" range
   - Add "Has donations" boolean
   - Add "Created date" range
   - Save filters to URL params

2. **Create Donation Filters** - `components/donations/DonationsFilters.tsx` (already exists)
   - Verify all filters work
   - Test with large datasets

3. **Backend Support** - `app/contacts/page.tsx`
   - Parse new filter params
   - Build dynamic where clauses
   - Optimize queries with indexes

**Success Criteria:**
- ✅ Multiple filters combine (AND logic)
- ✅ Filters persist on reload
- ✅ Clear filters button works
- ✅ Performance < 500ms with 10k+ records

**Agent Support:** Use Frontend Developer agent for filter UI

---

#### Day 9: Testing & Bug Fixes (6-8 hours)
**Goal:** Ensure everything works perfectly

**Tasks:**
1. **Manual Testing Checklist**
   - Test all CRUD operations
   - Test pagination on all pages
   - Test search with various queries
   - Test bulk operations
   - Test filters with different combinations
   - Test on mobile devices
   - Test error states (intentional failures)

2. **Security Testing**
   - Verify CSRF protection works
   - Test rate limiting (exceed limits)
   - Try SQL injection on all inputs
   - Test XSS prevention
   - Verify PII encryption

3. **Performance Testing**
   - Load pages with 10,000+ records
   - Test query performance
   - Check bundle size
   - Lighthouse audit (aim for 90+)

4. **Bug Fixes**
   - Fix any issues found
   - Improve error messages
   - Polish UX rough edges

**Success Criteria:**
- ✅ No critical bugs
- ✅ All features working
- ✅ Security tests pass
- ✅ Performance acceptable

---

### **SPRINT 4: Deployment & Documentation (Day 10)**

#### Day 10: Production Deployment (4-6 hours)
**Goal:** Deploy to production with monitoring

**Tasks:**
1. **Pre-Deployment Checklist**
   - [ ] All tests passing
   - [ ] Build succeeds locally
   - [ ] Environment variables set
   - [ ] Database migrations run
   - [ ] Encryption key generated
   - [ ] CSRF secret set

2. **Deploy to Vercel**
   - Run `npm run build`
   - Commit final changes
   - Push to GitHub
   - Verify deployment succeeds
   - Test production URL

3. **Post-Deployment Verification**
   - Test all critical paths
   - Verify authentication works
   - Test database connections
   - Check error logging
   - Monitor performance

4. **Documentation**
   - Update README with deployment info
   - Document environment variables
   - Create admin guide
   - Write user quick-start guide

**Success Criteria:**
- ✅ Deployed to production
- ✅ All features working in prod
- ✅ No errors in logs
- ✅ Documentation complete

---

## 📋 DAILY TASK BREAKDOWN

### **Day 1 - Contact CRUD**
**Morning (4 hours):**
1. Create `app/api/contacts/[id]/route.ts`
2. Test GET/PUT/DELETE endpoints
3. Add Zod validation

**Afternoon (4 hours):**
1. Create edit page
2. Add delete button to detail page
3. Test end-to-end flow

---

### **Day 2 - Global Search**
**Morning (3 hours):**
1. Update search API
2. Add debounce logic to DashboardLayout

**Afternoon (3 hours):**
1. Create dropdown results UI
2. Add keyboard navigation
3. Test search functionality

---

### **Day 3 - Detail Page UX**
**Morning (3 hours):**
1. Use agent to generate loading states
2. Create 10 loading.tsx files

**Afternoon (3 hours):**
1. Use agent to generate error boundaries
2. Create 10 error.tsx files
3. Test all states

---

### **Day 4 - Security Part 1**
**Morning (4 hours):**
1. Implement CSRF protection
2. Add to all forms

**Afternoon (4 hours):**
1. Implement rate limiting
2. Update middleware
3. Test security measures

---

### **Day 5 - Audit Logging**
**Morning (3 hours):**
1. Create audit system
2. Add to all API routes

**Afternoon (3 hours):**
1. Create audit log viewer
2. Test logging
3. Verify performance

---

### **Day 6 - Bulk Operations**
**Morning (3 hours):**
1. Verify bulk API endpoint
2. Create bulk actions UI

**Afternoon (4 hours):**
1. Add checkboxes to table
2. Implement select all
3. Test bulk operations

---

### **Day 7 - PII Encryption**
**Morning (3 hours):**
1. Update encryption on write
2. Update decryption on read

**Afternoon (3 hours):**
1. Create migration script
2. Test with sample data
3. Verify backwards compatibility

---

### **Day 8 - Advanced Filters**
**Morning (4 hours):**
1. Enhance contact filters
2. Add new filter types

**Afternoon (3 hours):**
1. Update backend parsing
2. Optimize queries
3. Test with large datasets

---

### **Day 9 - Testing & Fixes**
**Morning (4 hours):**
1. Manual testing all features
2. Security testing

**Afternoon (4 hours):**
1. Performance testing
2. Fix bugs found
3. Polish UX

---

### **Day 10 - Deployment**
**Morning (3 hours):**
1. Pre-deployment checks
2. Deploy to Vercel
3. Post-deployment verification

**Afternoon (2 hours):**
1. Monitor production
2. Write documentation
3. Celebrate launch! 🎉

---

## 🤖 AI AGENT UTILIZATION PLAN

### How to Use Agents for Faster Development

#### Frontend Developer Agent
```bash
# Generate edit page
npm run agent:run frontend-developer "Create contact edit page with pre-populated form"

# Generate bulk actions UI
npm run agent:run frontend-developer "Create bulk actions floating bar with export, tag, delete actions"

# Generate loading states (batch)
npm run agent:batch scripts/agents/examples/loading-states-batch.json
```

#### Backend Architect Agent
```bash
# Security review
npm run agent:run backend-architect "Review all API routes for security vulnerabilities"

# Audit system design
npm run agent:run backend-architect "Design audit logging system with non-blocking writes"

# Query optimization
npm run agent:run backend-architect "Optimize contact list query for 10,000+ records"
```

#### Batch Generation Strategy
Create `scripts/agents/examples/loading-states-batch.json`:
```json
[
  {
    "agentName": "frontend-developer",
    "task": "Create loading skeleton for contact detail page",
    "context": {
      "componentType": "page",
      "name": "ContactDetailLoading",
      "requirements": "Skeleton matching contact detail layout with profile section and donations list"
    }
  },
  // ... 9 more similar tasks
]
```

Then run: `npm run agent:batch scripts/agents/examples/loading-states-batch.json`

---

## 🎯 SUCCESS METRICS

### Technical Metrics
- ✅ Build time < 60 seconds
- ✅ Page load time < 2 seconds (TTFB)
- ✅ API response time < 500ms
- ✅ Lighthouse score > 90
- ✅ Zero TypeScript errors
- ✅ Zero console errors

### Feature Completeness
- ✅ All CRUD operations working
- ✅ Search functional and fast
- ✅ Bulk operations working
- ✅ Security measures in place
- ✅ Audit logging complete
- ✅ PII encrypted at rest

### User Experience
- ✅ Loading states everywhere
- ✅ Error boundaries with recovery
- ✅ Toast notifications on actions
- ✅ Mobile responsive
- ✅ Accessible (WCAG 2.1 AA)
- ✅ No jarring UX transitions

---

## 🚨 RISK MITIGATION

### High-Risk Items
1. **PII Encryption Migration**
   - Risk: Data loss or corruption
   - Mitigation: Backup database first, test on staging, run in batches

2. **Rate Limiting**
   - Risk: Legitimate users blocked
   - Mitigation: Conservative limits, monitoring, easy override for admins

3. **Bulk Operations**
   - Risk: Accidental mass deletion
   - Mitigation: Confirmation dialogs, soft deletes, audit logging

### Contingency Plans
- If encryption migration fails → Roll back, investigate, try again
- If search performance poor → Add database indexes, implement caching
- If security testing reveals issues → Fix immediately before deployment

---

## 📦 DEPENDENCIES & BLOCKERS

### External Dependencies
- ✅ Anthropic API (for agents) - Optional, not blocking
- ✅ Vercel deployment - Critical
- ✅ PostgreSQL database - Critical
- ✅ Environment variables set - Critical

### Internal Dependencies
- Day 2 depends on Day 1 (need contact edit before testing)
- Day 7 depends on Day 5 (audit logging needed before encryption)
- Day 10 depends on Days 1-9 (all features complete)

### No Blockers Identified
- All tools and infrastructure in place
- No external API integrations required
- Team familiar with codebase

---

## 🎉 POST-LAUNCH PLAN (Days 11-14)

### Day 11: Monitoring & Bug Fixes
- Monitor production logs
- Fix any issues reported
- Gather user feedback

### Day 12: Agent Implementation
- Implement AI Engineer agent
- Implement Content Creator agent
- Implement API Tester agent

### Day 13: Advanced Analytics
- Build reports page fully
- Add charts and graphs
- Export reports to PDF

### Day 14: Email Integration
- Integrate Resend for emails
- Create email templates
- Send thank-you emails automatically

---

## 📈 PROGRESS TRACKING

### Week 1 Milestones
- [ ] Day 1: Contact CRUD complete
- [ ] Day 2: Search functional
- [ ] Day 3: All loading/error states
- [ ] Day 4: Security hardened
- [ ] Day 5: Audit logging live

### Week 2 Milestones
- [ ] Day 6: Bulk operations working
- [ ] Day 7: PII encrypted
- [ ] Day 8: Advanced filters done
- [ ] Day 9: All tests passing
- [ ] Day 10: Deployed to production! 🚀

---

## 🎓 LESSONS LEARNED (TO UPDATE AFTER COMPLETION)

### What Went Well
- (To be filled during implementation)

### What Could Improve
- (To be filled during implementation)

### Key Takeaways
- (To be filled during implementation)

---

## ✅ FINAL CHECKLIST

### Before Launch
- [ ] All CRUD operations tested
- [ ] Search working perfectly
- [ ] Bulk operations tested
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Mobile responsive verified
- [ ] Error handling complete
- [ ] Documentation written
- [ ] Environment variables set
- [ ] Database backed up

### Launch Day
- [ ] Deploy to production
- [ ] Verify all features work
- [ ] Monitor for errors
- [ ] Test critical paths
- [ ] Announce to users

### Post-Launch
- [ ] Monitor logs daily
- [ ] Gather user feedback
- [ ] Fix bugs promptly
- [ ] Plan next features

---

**Total Estimated Time:** 10 days (60-80 hours)
**Priority Level:** HIGH - Production Launch
**Team Size:** 1 developer + AI agents
**Success Probability:** 95%

Let's ship this! 🚀
