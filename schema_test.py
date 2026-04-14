#!/usr/bin/env python3
"""
Test to verify schema normalization is working correctly
"""

import requests
import json
import os

BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'https://guidance-hub-78.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def test_schema_normalization():
    """Test that the API correctly handles both schema formats"""
    
    print("=" * 60)
    print("SCHEMA NORMALIZATION TESTING")
    print("=" * 60)
    
    # Create an assessment
    assessment_data = {
        "name": "Kavya Singh",
        "email": "kavya.singh@nit.ac.in", 
        "college": "NIT Trichy",
        "answers_json": {
            "q1": "c",
            "q2": "c",
            "q3": "c", 
            "q4": "c",
            "q5": "c"
        }
    }
    
    print("Creating assessment to test schema normalization...")
    response = requests.post(
        f"{API_BASE}/assessments",
        json=assessment_data,
        headers={'Content-Type': 'application/json'},
        timeout=15
    )
    
    if response.status_code == 201:
        data = response.json()
        assessment = data['assessment']
        assessment_id = assessment['id']
        
        print(f"✅ Assessment created: {assessment_id}")
        print(f"   User: {assessment['user']['name']}")
        print(f"   Answers format: {'answers_json' in assessment}")
        print(f"   AI Analysis format: {'ai_analysis' in assessment}")
        
        # Verify the response is normalized
        if 'answers_json' in assessment and 'ai_analysis' in assessment:
            print("✅ Response correctly normalized to frontend format")
            
            # Check AI analysis structure
            ai_analysis = assessment['ai_analysis']
            required_fields = ['readiness_score', 'recommendations', 'summary', 'roadmap']
            missing_fields = [field for field in required_fields if field not in ai_analysis]
            
            if not missing_fields:
                print("✅ AI analysis has all required fields")
                print(f"   Readiness score: {ai_analysis['readiness_score']}")
                print(f"   Top recommendation: {ai_analysis['recommendations'][0]['title']}")
            else:
                print(f"❌ AI analysis missing fields: {missing_fields}")
        else:
            print("❌ Response not properly normalized")
            
        # Test retrieval also returns normalized format
        print("\nTesting retrieval normalization...")
        get_response = requests.get(f"{API_BASE}/assessments/{assessment_id}", timeout=10)
        
        if get_response.status_code == 200:
            get_data = get_response.json()
            get_assessment = get_data['assessment']
            
            if 'answers_json' in get_assessment and 'ai_analysis' in get_assessment:
                print("✅ Retrieval also returns normalized format")
            else:
                print("❌ Retrieval not properly normalized")
        else:
            print(f"❌ Retrieval failed: {get_response.status_code}")
            
    else:
        print(f"❌ Assessment creation failed: {response.status_code}")
        print(f"   Response: {response.text}")

if __name__ == "__main__":
    test_schema_normalization()