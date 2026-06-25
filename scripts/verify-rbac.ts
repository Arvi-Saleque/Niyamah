import { canAssignRole, canModifyTarget } from "../src/modules/auth/domain/staff-access-policy";
import { SYSTEM_ROLES } from "../src/modules/auth/domain/rbac-catalog";

function verifyRbac() {
  console.log("Verifying RBAC Integrity...");
  let passed = true;

  // 1. Verify Catalog
  const owner = SYSTEM_ROLES.find(r => r.key === "owner");
  if (!owner) {
    console.error("❌ Catalog missing owner role!");
    passed = false;
  }
  const admin = SYSTEM_ROLES.find(r => r.key === "administrator");
  if (!admin) {
    console.error("❌ Catalog missing administrator role!");
    passed = false;
  }

  // 2. Verify Policy: Owner can assign Administrator
  if (!canAssignRole("owner", "administrator")) {
    console.error("❌ Policy fail: Owner cannot assign Administrator");
    passed = false;
  }

  // 3. Verify Policy: Administrator cannot assign Administrator
  if (canAssignRole("administrator", "administrator")) {
    console.error("❌ Policy fail: Administrator CAN assign Administrator (should be false)");
    passed = false;
  }

  // 4. Verify Policy: Administrator can assign Manager
  if (!canAssignRole("administrator", "manager")) {
    console.error("❌ Policy fail: Administrator cannot assign Manager");
    passed = false;
  }

  // 5. Verify Policy: Manager cannot assign anything
  if (canAssignRole("manager", "viewer")) {
    console.error("❌ Policy fail: Manager CAN assign viewer (should be false)");
    passed = false;
  }

  // 6. Verify Policy: Cannot modify self
  if (canModifyTarget("user1", "owner", "user1", "owner")) {
    console.error("❌ Policy fail: User CAN modify self");
    passed = false;
  }

  // 7. Verify Policy: Owner cannot be modified by Admin
  if (canModifyTarget("admin1", "administrator", "owner1", "owner")) {
    console.error("❌ Policy fail: Admin CAN modify owner");
    passed = false;
  }

  // 8. Verify Policy: Admin cannot modify Admin
  if (canModifyTarget("admin1", "administrator", "admin2", "administrator")) {
    console.error("❌ Policy fail: Admin CAN modify another Admin");
    passed = false;
  }

  if (passed) {
    console.log("✅ RBAC Verification complete.");
    process.exit(0);
  } else {
    console.error("❌ RBAC Verification failed.");
    process.exit(1);
  }
}

verifyRbac();
