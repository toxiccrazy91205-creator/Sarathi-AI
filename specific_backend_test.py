#!/usr/bin/env python3
"""
Specific Backend Tests for SARATHI API
Testing the exact flows mentioned in the review request
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def log_test(test_name, success, details=""):
    """Log test results with timestamp"""
    status = "✅ PASS" if success else "❌ FAIL"
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {status} {test_name}")
    if details:
        print(f"    Details: {details}")
    print()

def test_specific_flow():
    """Test the specific backend flows mentioned in review request"""
    
    print("=" * 70)
    print("SARATHI API - Specific Flow Testing")
    print("Testing flows mentioned in review request")
    print("=" * 70)
    print()
    
    # 1. POST /api/assessments with valid data -> should return 201 and assessment payload
    print("1. Testing POST /api/assessments with valid data")
    assessment_data = {
        "name": "Arjun Patel",
        "email": "arjun.patel@iitb.ac.in",
        "college": "IIT Bombay",
        "answers_json": {
            "q1": "a",
            "q2": "b", 
            "q3": "a",
            "q4": "a",
            "q5": "a"
        }
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/assessments",
            json=assessment_data,
            headers={'Content-Type': 'application/json'},
            timeout=15
        )
        
        if response.status_code == 201:
            data = response.json()
            if data.get('ok') and 'assessment' in data:
                assessment = data['assessment']
                assessment_id = assessment.get('id')
                log_test("POST /api/assessments (201 + payload)", True, 
                        f"Created assessment ID: {assessment_id}, User: {assessment.get('user', {}).get('name')}")
            else:
                log_test("POST /api/assessments (201 + payload)", False, f"Missing assessment data: {data}")
                return None
        else:
            log_test("POST /api/assessments (201 + payload)", False, 
                    f"Expected 201, got {response.status_code}: {response.text}")
            return None
    except Exception as e:
        log_test("POST /api/assessments (201 + payload)", False, f"Exception: {str(e)}")
        return None
    
    # 2. GET /api/assessments/:id -> should return normalized assessment payload
    print("2. Testing GET /api/assessments/:id for normalized payload")
    try:
        response = requests.get(f"{API_BASE}/assessments/{assessment_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and 'assessment' in data:
                assessment = data['assessment']
                # Check for normalized fields
                has_answers_json = 'answers_json' in assessment
                has_ai_analysis = 'ai_analysis' in assessment
                has_user = 'user' in assessment
                
                if has_answers_json and has_ai_analysis and has_user:
                    log_test("GET /api/assessments/:id (normalized)", True, 
                            f"Normalized fields present: answers_json, ai_analysis, user")
                else:
                    missing = []
                    if not has_answers_json: missing.append('answers_json')
                    if not has_ai_analysis: missing.append('ai_analysis')
                    if not has_user: missing.append('user')
                    log_test("GET /api/assessments/:id (normalized)", False, 
                            f"Missing normalized fields: {', '.join(missing)}")
            else:
                log_test("GET /api/assessments/:id (normalized)", False, f"Invalid response structure: {data}")
        else:
            log_test("GET /api/assessments/:id (normalized)", False, 
                    f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("GET /api/assessments/:id (normalized)", False, f"Exception: {str(e)}")
    
    # 3. GET /api/results/:id before payment -> should return 402
    print("3. Testing GET /api/results/:id before payment (should be 402)")
    try:
        response = requests.get(f"{API_BASE}/results/{assessment_id}", timeout=10)
        
        if response.status_code == 402:
            data = response.json()
            if 'payment required' in data.get('error', '').lower():
                log_test("GET /api/results/:id before payment (402)", True, 
                        f"Correctly gated: {data.get('error')}")
            else:
                log_test("GET /api/results/:id before payment (402)", False, 
                        f"Wrong error message: {data.get('error')}")
        else:
            log_test("GET /api/results/:id before payment (402)", False, 
                    f"Expected 402, got {response.status_code}")
    except Exception as e:
        log_test("GET /api/results/:id before payment (402)", False, f"Exception: {str(e)}")
    
    # 4. POST /api/payments/mock -> should mark payment_status true
    print("4. Testing POST /api/payments/mock (should mark payment_status true)")
    try:
        payment_data = {"assessmentId": assessment_id}
        
        response = requests.post(
            f"{API_BASE}/payments/mock",
            json=payment_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and 'payment' in data:
                payment = data['payment']
                assessment_returned = data.get('assessment', {})
                
                payment_success = payment.get('status') == 'MOCKED_SUCCESS'
                amount_correct = payment.get('amount_inr') == 99
                
                if payment_success and amount_correct:
                    log_test("POST /api/payments/mock (payment_status true)", True, 
                            f"Payment successful: {payment.get('status')}, Amount: ₹{payment.get('amount_inr')}")
                else:
                    log_test("POST /api/payments/mock (payment_status true)", False, 
                            f"Payment status: {payment.get('status')}, Amount: {payment.get('amount_inr')}")
            else:
                log_test("POST /api/payments/mock (payment_status true)", False, 
                        f"Invalid response structure: {data}")
        else:
            log_test("POST /api/payments/mock (payment_status true)", False, 
                    f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("POST /api/payments/mock (payment_status true)", False, f"Exception: {str(e)}")
    
    # 5. GET /api/results/:id after payment -> should return 200 with dashboard data
    print("5. Testing GET /api/results/:id after payment (should return 200 with dashboard)")
    try:
        response = requests.get(f"{API_BASE}/results/{assessment_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') and 'assessment' in data:
                assessment = data['assessment']
                
                # Check for dashboard data
                has_payment_status = assessment.get('payment_status') == True
                has_ai_analysis = 'ai_analysis' in assessment and assessment['ai_analysis']
                has_user_data = 'user' in assessment and assessment['user']
                
                if has_payment_status and has_ai_analysis and has_user_data:
                    ai_analysis = assessment['ai_analysis']
                    has_readiness_score = 'readiness_score' in ai_analysis
                    has_recommendations = 'recommendations' in ai_analysis
                    has_roadmap = 'roadmap' in ai_analysis
                    
                    if has_readiness_score and has_recommendations and has_roadmap:
                        log_test("GET /api/results/:id after payment (200 + dashboard)", True, 
                                f"Dashboard data complete: readiness_score={ai_analysis.get('readiness_score')}, "
                                f"recommendations={len(ai_analysis.get('recommendations', []))}")
                    else:
                        missing = []
                        if not has_readiness_score: missing.append('readiness_score')
                        if not has_recommendations: missing.append('recommendations')
                        if not has_roadmap: missing.append('roadmap')
                        log_test("GET /api/results/:id after payment (200 + dashboard)", False, 
                                f"Missing dashboard fields: {', '.join(missing)}")
                else:
                    missing = []
                    if not has_payment_status: missing.append('payment_status')
                    if not has_ai_analysis: missing.append('ai_analysis')
                    if not has_user_data: missing.append('user')
                    log_test("GET /api/results/:id after payment (200 + dashboard)", False, 
                            f"Missing required fields: {', '.join(missing)}")
            else:
                log_test("GET /api/results/:id after payment (200 + dashboard)", False, 
                        f"Invalid response structure: {data}")
        else:
            log_test("GET /api/results/:id after payment (200 + dashboard)", False, 
                    f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("GET /api/results/:id after payment (200 + dashboard)", False, f"Exception: {str(e)}")
    
    # 6. Ensure health/questions endpoints still work
    print("6. Testing health and questions endpoints still work")
    try:
        # Health endpoint
        health_response = requests.get(f"{API_BASE}", timeout=10)
        health_ok = health_response.status_code == 200 and health_response.json().get('ok')
        
        # Questions endpoint  
        questions_response = requests.get(f"{API_BASE}/assessment/questions", timeout=10)
        questions_ok = questions_response.status_code == 200 and len(questions_response.json().get('questions', [])) == 5
        
        if health_ok and questions_ok:
            log_test("Health and questions endpoints", True, 
                    "Both endpoints working correctly")
        else:
            issues = []
            if not health_ok: issues.append('health endpoint failed')
            if not questions_ok: issues.append('questions endpoint failed')
            log_test("Health and questions endpoints", False, 
                    f"Issues: {', '.join(issues)}")
    except Exception as e:
        log_test("Health and questions endpoints", False, f"Exception: {str(e)}")
    
    print("=" * 70)
    print("SPECIFIC FLOW TESTING COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    test_specific_flow()